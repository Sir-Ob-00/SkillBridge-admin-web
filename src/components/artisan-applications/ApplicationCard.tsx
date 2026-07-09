import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ApplicationStatusBadge } from './ApplicationStatusBadge'
import type { ArtisanApplication } from '@/types/artisanApplication.types'
import { format } from 'date-fns'
import { Eye, MapPin, Calendar, Briefcase } from 'lucide-react'

interface ApplicationCardProps {
  application: ArtisanApplication
  onViewDetails: (id: string) => void
}

export function ApplicationCard({ application, onViewDetails }: ApplicationCardProps) {
  const { personalInformation, businessInformation, skills, submittedAt, status } = application

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              {personalInformation.profilePhoto ? (
                <AvatarImage src={personalInformation.profilePhoto} alt={`${personalInformation.firstName} ${personalInformation.lastName}`} />
              ) : null}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(personalInformation.firstName, personalInformation.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{businessInformation.businessName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {personalInformation.firstName} {personalInformation.lastName}
              </p>
            </div>
          </div>
          <ApplicationStatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-4" />
            <span>{personalInformation.city}, {personalInformation.state}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Briefcase className="size-4" />
            <span>{businessInformation.yearsOfExperience} years experience</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="size-4" />
            <span>{format(new Date(submittedAt), 'MMM dd, yyyy')}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 3).map((skill) => (
            <Badge key={skill.id} variant="outline" className="text-xs">
              {skill.name}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{skills.length - 3} more
            </Badge>
          )}
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onViewDetails(application.id)}
          >
            <Eye className="mr-2 size-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
